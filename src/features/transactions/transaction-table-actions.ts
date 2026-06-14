import type {
  TransactionActionAvailability,
  TransactionListItemData
} from "./transaction-list-types";

export type TransactionActionCallbacks = {
  onEditTransaction?: (transaction: TransactionListItemData) => void;
  onDeleteTransaction?: (transaction: TransactionListItemData) => void;
};

export function getTransactionActionAvailability(
  callbacks: TransactionActionCallbacks
): TransactionActionAvailability {
  return {
    canEdit: Boolean(callbacks.onEditTransaction),
    canDelete: Boolean(callbacks.onDeleteTransaction)
  };
}
