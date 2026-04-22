"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/admin/orders";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [selected, setSelected] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateOrderStatus(orderId, selected);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      <select
        value={selected}
        onChange={(e) => { setSelected(e.target.value); setSaved(false); }}
        className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <Button onClick={handleSave} disabled={saving || selected === currentStatus && !saved}>
        {saved ? (
          <><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Saved!</>
        ) : saving ? "Saving..." : "Update Status"}
      </Button>
    </div>
  );
}
