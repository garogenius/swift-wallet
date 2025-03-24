import { useState } from "react";

export const useSecureStorage = () => {
  // Store an item securely
  const storeItem = async (key: string, data: string) => {
    try {
      // Use platform-specific secure storage if needed
      sessionStorage.setItem(key, data);
    } catch (error) {
      console.error("Error storing item:", error);
    }
  };

  // Retrieve an item securely
  const getItem = async (key: string) => {
    try {
      const data = sessionStorage.getItem(key);
      if (data) {
        return data;
      } else {
        console.warn("Item not found for key:", key);
        return null;
      }
    } catch (error) {
      console.error("Error retrieving item:", error);
      return null;
    }
  };

  // Remove an item securely
  const removeItem = async (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Hook returns the functions for usage
  return { storeItem, getItem, removeItem };
};
