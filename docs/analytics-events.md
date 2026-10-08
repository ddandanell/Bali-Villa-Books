# VillaBooks Bali custom analytics events

The shared trackEvent wrapper forwards allowlisted events to Replit's injected tracker. No analytics script, website ID or environment variable is configured in the app. Enable analytics in Publishing settings and publish or republish to activate the tracker.

## Events

| Description | Event name |
|---|---|
| A WhatsApp link is opened; this does not mean a message was sent | whatsapp_click |
| A phone link is clicked; this does not mean a call connected | phone_click |
| An existing consultation CTA is clicked in the header, footer or article | consultation_click |
| The first form change, once per mounted form | enquiry_form_started |
| The package preference is changed in the enquiry form | plan_selected |
| The server successfully saves an enquiry | enquiry_submitted |
| The sample report is opened | sample_report_view |
| CSV export or browser print is initiated | sample_report_download |
| A published article is opened | blog_view |
| The existing article-end scroll threshold is reached | article_completion |

Dimensions are public page, placement, optional service and optional plan. Plan values are Starter, Professional, Premium, Cleanup or unspecified; form option prices and arbitrary input are not transmitted. Only scalar values are used. Query strings and hashes are omitted. Unknown error-page paths use other_page.

The app does not send names, email addresses, phone numbers, messages, employee or financial information, enquiry references, or arbitrary form values in custom events. Pageviews and platform-level visitor measurement are handled by the hosted tracker, not this wrapper.

## Counting and reliability

- Enquiry success fires after mutateAsync resolves, not on the submit button or validation failure.
- The backend already records a saved enquiry within its transaction. Browser enquiry success does not POST a duplicate site-event record.
- Existing first-party event storage and editorial engagement tracking are preserved. New form-start and plan-selection events are dashboard-only and do not change the API.
- WhatsApp and consultation events are different dimensions of the same CTA in some placements; do not add them together as unique leads.
- Article and sample-report opens are custom events separate from automatic pageviews, not additional automatic pageviews.
- Missing, blocked, throwing or asynchronously failing trackers must not interrupt contact, form submission, download or reading.
- Custom events in development are normally no-ops for hosted analytics because the tracker is injected only into supported published sites.

## Useful questions after data arrives

- Which page and CTA placement generates the most WhatsApp contact clicks?
- What percentage of started enquiry forms results in a successfully saved enquiry?
- Which package preferences are selected, and how many saved enquiries express each preference?
