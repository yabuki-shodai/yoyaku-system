"use client";

import MenuEditor from "@/components/menus/MenuEditor";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAdmin } from "@/lib/admin-context";

export default function MenusPage() {
  const { menus, changeMenuItem, addMenuItem, removeMenuItem } = useAdmin();

  return (
    <ProtectedRoute screen="menus">
      {() => (
        <MenuEditor
          menus={menus}
          onChangeItem={changeMenuItem}
          onAddItem={addMenuItem}
          onRemoveItem={removeMenuItem}
        />
      )}
    </ProtectedRoute>
  );
}
