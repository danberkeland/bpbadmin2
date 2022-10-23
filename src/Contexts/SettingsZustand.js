import create from "zustand";
import { devtools } from "zustand/middleware";

const { DateTime } = require("luxon");

let today = DateTime.now()
  .setZone("America/Los_Angeles")
  .toString()
  .split("T")[0];

const store = (set) => ({
  user: "",
  setUser: (user) => set(() => ({ user: user })),
  access: "",
  setAccess: (access) => set(() => ({ access: access })),
  formType: "",
  setFormType: (formType) => set(() => ({ formType: formType })),
  authType: 1,
  setAuthType: (authType) => set(() => ({ authType: authType })),
  isLoading: false,
  setIsLoading: (isLoading) => set(() => ({ isLoading: isLoading })),
  delivDate: today,
  setDelivDate: (delivDate) => set(() => ({ delivDate: delivDate })),
  items: [],
  setItems: (items) => set(() => ({ items: items })),
  currentOrder: [],
  setCurrentOrder: (currentOrder) =>
    set(() => ({ currentOrder: currentOrder })),
  isEdit: false,
  setIsEdit: (isEdit) => set(() => ({ isEdit: isEdit })),
  isCreate: false,
  setIsCreate: (isCreate) => set(() => ({ isCreate: isCreate })),
  isChange: false,
  setIsChange: (isChange) => set(() => ({ isChange: isChange })),
});

export const useSettingsStore = create(devtools(store));
