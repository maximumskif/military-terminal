# Document snapshots milestone

Source Intelligence now offers RETRIEVE / REVIEW DOCUMENT on stored evidence. Approved HTML sources are retained as original files by SHA-256 hash in private runtime storage. Versions link the source, retrieval time, feed publication value, extracted passage IDs and previous version. Identical retrievals do not create another version. Formatting-only changes are labelled separately; text differences show added and removed passages.

Extraction is provisional: it does not establish obligations, ownership, supplier participation or materiality. It extracts paragraphs, lists and table cells; visual table reconstruction is pending and boilerplate can remain. Cite both version hash and passage ID. Publication metadata may differ in precision from the underlying document.

Retrieval supports a fixed list of existing public-source hosts, HTTPS, public IPv4 resolution pinned to the connection, no redirects, a 20-second timeout and a 5MB limit. PDF, OCR and other hosts remain pending. Unsupported documents fail without replacing earlier versions. Page scripts and instructions do not execute.

Live validation: RTX Tomahawk release preserved with 18 passages. All seven test suites pass. Next: PDF support, review scheduling, change alerts, analyst verification controls and canonical program timelines.
