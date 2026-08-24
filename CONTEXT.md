# Post Array domain language

- **User**: A person with one identity who may belong to one or more workspaces.
- **Workspace**: The collaboration, authorization, audit, and billing boundary. A workspace owns members and projects.
- **Project**: A workspace-owned publishing context for one product, client, publication, or venture. It keeps its social channels, media, drafts, approvals, calendar, and publishing defaults together. An active project consumes one project slot from the workspace plan.
- **Active project**: A project that has not been archived. Archived projects retain their history but do not consume a project slot.
- **Social channel**: One connected provider account, Page, profile, channel, community, or publication. A channel belongs to one project.
- **Media asset**: A user-uploaded or URL-imported file retained for the disclosed period and optionally assigned to one project. Post Array does not generate image or video assets.
- **Draft**: The shared source content for a post. A draft belongs to one project and can target several social channels in that project.
- **Variant**: A platform-native change to one draft for one target. Unchanged fields continue to inherit from the draft.
- **Publication**: One idempotent request to send a frozen content version to one or more social channels.
- **Publication receipt**: The immutable record of one provider-side result, including unavailable facts as unavailable rather than zero.
