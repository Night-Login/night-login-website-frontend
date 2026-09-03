/** Response shapes consumed by the legacy frontend. Backend endpoints are unchanged. */
export interface OnboardingStatusResponse {
  data: { onboardingCompleted: boolean; role?: string };
}

export interface CreateTransactionResponse {
  orderId: string;
}

export interface CreatePaymentResponse {
  qrLink: string;
}

export interface ApiErrorResponse {
  message?: string;
}
