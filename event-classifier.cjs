const schema=require('./signal-schema.json');
const {day}=require('./funding-analysis.cjs');
const rules=[
 ['CANCELLATION_OR_TERMINATION',/\b(termination for (?:convenience|default)|stop.work order|(?:contract|award|solicitation) (?:terminated|cancelled|canceled|rescinded)|option not exercised|funding withdrawn|deobligation|scope reduction|lost recompete)\b/i],
 ['PROTEST_OR_CORRECTIVE_ACTION',/\b(bid protest|protest sustained|corrective action)\b/i],
 ['PROPOSED_FUNDING',/\b(budget request|proposed funding|requested funding|authorization|NDAA)\b/i],
 ['ENACTED_FUNDING',/\b(enacted (?:funding|appropriations?)|appropriations? enacted|signed (?:an? )?appropriations? (?:bill|act))\b/i],
 ['PROCUREMENT_FORECAST',/\b(procurement forecast|acquisition forecast)\b/i],
 ['SOURCES_SOUGHT_RFI',/\b(sources sought|request for information)\b/i],
 ['DRAFT_SOLICITATION',/\b(draft solicitation|draft RFP|draft request for proposals)\b/i],
 ['DOWN_SELECTION',/\b(down.selection|downselect|selected for negotiations)\b/i],
 ['FINAL_SOLICITATION',/\b(request for proposals|request for quotation|final solicitation|solicitation issued|commercial solutions opening|broad agency announcement)\b/i],
 ['PROTOTYPE_AWARD',/\b(prototype (?:agreement|award|contract)|other transaction agreement)\b/i],
 ['CONTRACT_VEHICLE_AWARD',/\b(IDIQ|indefinite.delivery.indefinite.quantity|contract vehicle|multiple.award (?:contract|vehicle))\b/i],
 ['FUNDED_TASK_OR_DELIVERY_ORDER',/\b(funded (?:task|delivery) order|(?:task|delivery) order.{0,60}(?:obligated|funded)|(?:funded|obligated).{0,60}(?:task|delivery) order)\b/i],
 ['OPTION_EXERCISE',/\b(option exercised|exercised (?:an? |the )?option|exercises (?:an? |the )?option)\b/i],
 ['CONTRACT_MODIFICATION',/\b(contract modification|modification to (?:the |a )?contract)\b/i],
 ['PRODUCTION_TRANSITION',/\b(production transition|low.rate initial production|full.rate production|Milestone C|initial operating capability|program of record)\b/i],
 ['GRANT',/\b(grant awarded|awarded (?:an? |the )?grant|grant funding|grant agreement)\b/i],
 ['LOAN_OR_GUARANTEE',/\b(loan guarantee|loan agreement|government loan|federal loan)\b/i],
 ['INDUSTRIAL_EXPANSION',/\b(manufacturing expansion|facility expansion|production capacity expansion|new manufacturing facility)\b/i],
 ['DEFINITIVE_CONTRACT_AWARD',/\b(contract awarded|awarded (?:an? |the )?(?:[\w-]+ ){0,4}contract|definitive contract|sole.source award|production contract|follow.on contract)\b/i]
];
function timestamp(value){if(!value)return {value:null,precision:'unknown',timezone:null};if(/^\d{4}-\d{2}-\d{2}$/.test(value))return {value,precision:day(value)===null?'invalid_date':'date',timezone:null};if(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(value))return {value,precision:'time',timezone:'unspecified'};if(!/(?:Z|[+-]\d{2}:?\d{2})$|\b(?:GMT|UTC)\b/i.test(value))return {value,precision:'unparsed',timezone:null};const n=Date.parse(value);return Number.isFinite(n)?{value:new Date(n).toISOString(),precision:'time',timezone:'UTC'}:{value,precision:'unparsed',timezone:null};}
function classify(row){
 const text=String(row.title||''),flags=[];const relevance=/\b(contract|procurement|solicitation|award|awarded|funded|task order|delivery order|sources sought|request for information|budget|authorization|NDAA|funding|appropriation|prototype|production|grant|loan|manufacturing|supplier|program|option|recompete|protest)\b/i.test(text)||Boolean(row.noticeId);
 if(/\b(may|might|could|rumou?r|reportedly|anticipated|expected|plans? to|seeks? to)\b/i.test(text))flags.push('speculative_or_forward_looking_language');
 if(/\b(no |not |never |denies? |hasn.t |wasn.t |didn.t |won.t )/i.test(text.replace(/option not exercised/gi,'')))flags.push('negation_requires_review');
 if(/\b(anniversary|last year|previously|repost|throwback|in 20(?:0\d|1\d|2[0-5]))\b/i.test(text))flags.push('historical_or_repeated_language');
 if(/["“”]/.test(text))flags.push('quoted_language_requires_context');
 if(/\b(AI|RFI|CSO|RFP|RFQ|BAA|OTA|LRIP)\b/.test(text))flags.push('acronym_requires_context');
 const publication=timestamp(row.publishedAt),detection=timestamp(row.firstSeen);if(publication.timezone==='UTC'&&detection.timezone==='UTC'&&Date.parse(detection.value)-Date.parse(publication.value)>7*86400000)flags.push('publication_predates_detection_by_over_seven_days');
 const matches=relevance?rules.filter(([,r])=>r.test(text)):[];let eventType=matches[0]?.[0]||'OTHER_OR_UNCLEAR',basis=matches[0]?`Headline phrase: ${matches[0][1].exec(text)[0]}`:'Insufficient procurement context or no supported event phrase';
 const noticeTypes={'Sources Sought':'SOURCES_SOUGHT_RFI','Solicitation':'FINAL_SOLICITATION','Combined Synopsis/Solicitation':'FINAL_SOLICITATION','Presolicitation':'OTHER_OR_UNCLEAR','Award Notice':'OTHER_OR_UNCLEAR','Special Notice':'OTHER_OR_UNCLEAR','Justification':'OTHER_OR_UNCLEAR'};
 if(row.noticeId&&Object.hasOwn(noticeTypes,row.noticeType)){const type=noticeTypes[row.noticeType];if(type==='FINAL_SOLICITATION'&&eventType==='DRAFT_SOLICITATION'){eventType='OTHER_OR_UNCLEAR';flags.push('conflicting_notice_type_and_headline');basis='Draft headline conflicts with supplied solicitation type; review required';}else if(type!=='OTHER_OR_UNCLEAR'){eventType=type;basis=`SAM supplied notice type: ${row.noticeType}`;}else if(eventType==='OTHER_OR_UNCLEAR')basis=`SAM ${row.noticeType}: subtype cannot be established from notice type alone`;}
 const negative=eventType==='CANCELLATION_OR_TERMINATION'&&/option not exercised|funding withdrawn|lost recompete|terminated|cancelled|canceled|deobligation|stop.work order/i.test(text);
 if(flags.includes('negation_requires_review')||flags.includes('speculative_or_forward_looking_language')){eventType='OTHER_OR_UNCLEAR';basis='Negated or speculative claim requires underlying-document review';}
 if(matches.length>1)flags.push('multiple_event_phrases_require_review');
 const financial=Object.fromEntries(schema.financialFields.map(k=>[k,null]));if(row.award?.amount!=null)financial.headlineAmount={value:row.award.amount,currency:null,basis:'SAM notice award.amount; amount type not established as base, ceiling or obligation'};
 const identity=Object.fromEntries(schema.identityFields.map(k=>[k,null]));identity.legalRecipient=row.award?.recipientName||null;identity.recipientUei=row.award?.recipientUei||null;identity.allocationStatus='UNKNOWN';
 const sourceConfidence=['official_record','official_announcement'].includes(row.sourceClass)?'primary_source':row.sourceClass==='company_statement'?'company_statement':row.sourceClass==='independent_reporting'?'independent_reporting':'unclassified_source';
 const substantive=eventType!=='OTHER_OR_UNCLEAR'&&!flags.includes('historical_or_repeated_language')&&!flags.includes('publication_predates_detection_by_over_seven_days')&&eventType!=='PROPOSED_FUNDING';
 return {version:1,eventType,basis,flags,classificationStatus:'provisional_requires_review',reviewScope:row.noticeId?'notice_metadata_only':'headline_only',financial,identity,governmentBuyer:row.agency||null,program:null,contractId:row.award?.number||null,solicitationId:row.solicitationNumber||null,timestamps:{eventDate:timestamp(row.award?.date),sourcePublication:timestamp(row.publishedAt),postPublication:timestamp(null),firstDetected:timestamp(row.firstSeen),lastUpdated:timestamp(row.previousTitles?.at(-1)?.changedAt||row.firstSeen),earliestKnownMatchingPublication:timestamp(null)},dimensions:{sourceConfidence,eventCertainty:'unverified_claim',financialMateriality:'UNKNOWN',novelty:'NOT_ASSESSED',observedMarketReaction:'NOT_AVAILABLE'},priority:substantive?'MEDIUM':'LOW',priorityReason:substantive?'Candidate event for research; identity, finances and novelty not verified':flags.includes('publication_predates_detection_by_over_seven_days')?'Publication predates detection by over seven days; novelty requires review':eventType==='PROPOSED_FUNDING'?'Proposed or authorized funding; no awarded contract established':'Insufficient context, historical language or unclear event',whyThisMayMatter:substantive?'May describe a procurement or funding milestone requiring primary-document review':null,unknowns:['Underlying document and attachments not reviewed','Recipient public parent and ownership dates not verified','Company allocation and financial materiality unknown','Earliest public disclosure and event novelty not established','Market data not connected'],supportingSourceUrls:[],primarySourceUrl:['official_record','official_announcement','company_statement'].includes(row.sourceClass)?row.url:null};
}
module.exports={classify,timestamp,eventTypes:schema.eventTypes};


