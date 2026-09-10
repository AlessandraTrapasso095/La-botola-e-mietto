"use client";

import { useEffect, useRef } from "react";

import { useCommerce } from "@/features/commerce/commerce-provider";

export function StripeConfirmationCartClear() {
  const { clearCartAfterCheckout } = useCommerce();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (clearedRef.current) {
      return;
    }

    clearedRef.current = true;
    clearCartAfterCheckout();
  }, [clearCartAfterCheckout]);

  return null;
}
