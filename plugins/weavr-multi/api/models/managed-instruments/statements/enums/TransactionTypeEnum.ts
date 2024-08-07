export enum TransactionTypeEnum {
    ACTIVATE_PHYSICAL_CARD = 'ACTIVATE_PHYSICAL_CARD',
    AUTHORISATION = 'AUTHORISATION',
    AUTHORISATION_DECLINE = 'AUTHORISATION_DECLINE',
    AUTHORISATION_EXPIRY = 'AUTHORISATION_EXPIRY',
    AUTHORISATION_MANUAL_CLOSE = 'AUTHORISATION_MANUAL_CLOSE',
    AUTHORISATION_REVERSAL = 'AUTHORISATION_REVERSAL',
    CARD_UPGRADE_TO_PHYSICAL = 'CARD_UPGRADE_TO_PHYSICAL',
    CHARGE_FEE = 'CHARGE_FEE',
    DEPOSIT = 'DEPOSIT',
    FEE_REVERSAL = 'FEE_REVERSAL',
    INSTRUMENT_BLOCK = 'INSTRUMENT_BLOCK',
    INSTRUMENT_CREATE = 'INSTRUMENT_CREATE',
    INSTRUMENT_DELETE = 'INSTRUMENT_DELETE',
    INSTRUMENT_REPLACE = 'INSTRUMENT_REPLACE',
    INSTRUMENT_UNBLOCK = 'INSTRUMENT_UNBLOCK',
    KYB_SYNC = 'KYB_SYNC',
    KYC_SYNC = 'KYC_SYNC',
    MANUAL_TRANSACTION = 'MANUAL_TRANSACTION',
    MERCHANT_REFUND = 'MERCHANT_REFUND',
    MERCHANT_REFUND_REVERSAL = 'MERCHANT_REFUND_REVERSAL',
    ORIGINAL_CREDIT_TRANSACTION = 'ORIGINAL_CREDIT_TRANSACTION',
    OUTGOING_WIRE_TRANSFER = 'OUTGOING_WIRE_TRANSFER',
    SEND = 'SEND',
    SETTLEMENT = 'SETTLEMENT',
    SETTLEMENT_REVERSAL = 'SETTLEMENT_REVERSAL',
    TRANSFER = 'TRANSFER',
    WITHDRAWAL_RELEASE = 'WITHDRAWAL_RELEASE',
    WITHDRAWAL_RESERVE = 'WITHDRAWAL_RESERVE',
    WITHDRAWAL = 'WITHDRAWAL',
}
