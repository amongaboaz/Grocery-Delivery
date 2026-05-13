import type { Address } from "../types";
import type React from "react";

import {
  CheckCircleIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import api from "../config/api";
import toast from "react-hot-toast";

interface AddressCardProps {
  addr: Address;

  onEditHandler: (addr: Address) => void;

  setAddresses: React.Dispatch<
    React.SetStateAction<Address[]>
  >;
}

const AddressCard = ({
  addr,
  onEditHandler,
  setAddresses,
}: AddressCardProps) => {

  // =========================
  // DELETE ADDRESS
  // =========================
  const deleteHandler = async () => {
    try {
      const confirmed = window.confirm(
        "Delete this address?"
      );

      if (!confirmed) return;

      const { data } = await api.delete(
        `/addresses/${addr.id}`
      );

      setAddresses(data?.addresses || []);

      toast.success("Address deleted");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete address"
      );
    }
  };

  // IMPORTANT:
  // MUST RETURN JSX
  return (
    <div className="bg-white border border-app-border rounded-2xl p-5 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        {/* ADDRESS INFO */}
        <div className="flex-1">

          <div className="flex items-center gap-2 mb-2">

            <h3 className="text-lg font-semibold text-app-green">
              {addr.label}
            </h3>

            {addr.isDefault && (
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <CheckCircleIcon className="size-3" />
                Default
              </span>
            )}
          </div>

          <p className="text-sm text-app-text-light leading-6">
            {addr.address}
          </p>

          <p className="text-sm text-app-text-light">
            {addr.city}, {addr.state}
          </p>

          <p className="text-sm text-app-text-light">
            ZIP: {addr.zip}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">

          <button
            onClick={() => onEditHandler(addr)}
            className="p-2 rounded-xl border border-app-border hover:bg-app-cream transition"
          >
            <PencilIcon className="size-4 text-app-green" />
          </button>

          <button
            onClick={deleteHandler}
            className="p-2 rounded-xl border border-red-200 hover:bg-red-50 transition"
          >
            <Trash2Icon className="size-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;