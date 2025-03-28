"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { Persistor } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { AppStore, makeStoreForProduction } from "@/store/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { store, persistor } = makeStoreForProduction();
  const storeRef = useRef<AppStore>(store);
  const persistorRef = useRef<Persistor>(persistor);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
}