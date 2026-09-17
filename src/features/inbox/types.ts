// Static-only for this phase — see CLAUDE.md: the mock backend has one
// thread, not a per-user inbox, so these rows are fake display data that all
// navigate to the same real chat screen.
export type ConversationRow = {
  id: string;
  fullName: string;
  username: string;
  preview: string;
  timeAgo: string;
  online: boolean;
};
