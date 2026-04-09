declare module '@cashfreepayments/cashfree-js' {
  interface CashfreeSDKConfig {
    mode: 'sandbox' | 'production';
  }

  interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | 'iframe';
  }

  interface CashfreeInstance {
    checkout(options: CheckoutOptions): Promise<any>;
  }

  export function load(config: CashfreeSDKConfig): Promise<CashfreeInstance>;
}