import { useEffect, useState } from "react";
import type { Address } from "../types";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Loading from "../components/Loading";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import toast from "react-hot-toast";

const Addresses = () => {
  const { updateUser } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setForm({
      label: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =========================
  // GET USER LOCATION
  // =========================
  const getLocation = (
    maxRetries = 3
  ): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      let attempts = 0;

      const attemptLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            if (attempts < maxRetries) {
              attempts++;
              setTimeout(attemptLocation, 1000);
            } else {
              reject(
                new Error(
                  error.message || "Failed to get location"
                )
              );
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
          }
        );
      };

      attemptLocation();
    });
  };

  // =========================
  // FETCH ADDRESSES
  // =========================
  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/addresses");

      console.log("Fetched Addresses:", data);

      const fetchedAddresses = Array.isArray(data?.addresses)
        ? data.addresses
        : [];

      setAddresses(fetchedAddresses);

      updateUser({
        addresses: fetchedAddresses,
      });
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load addresses"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD OR UPDATE ADDRESS
  // =========================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      let payload: any = {
        ...form,
      };

      // Only request geolocation when creating new address
      if (!editingId) {
        const location = await getLocation();

        payload = {
          ...payload,
          lat: location.lat,
          lng: location.lng,
        };
      }

      let response;

      // UPDATE
      if (editingId) {
        response = await api.put(
          `/addresses/${editingId}`,
          payload
        );

        toast.success("Address updated successfully");
      } else {
        // CREATE
        response = await api.post("/addresses", payload);

        toast.success("Address added successfully");
      }

      console.log("Response:", response.data);

      const updatedAddresses = Array.isArray(
        response.data?.addresses
      )
        ? response.data.addresses
        : [];

      setAddresses(updatedAddresses);

      updateUser({
        addresses: updatedAddresses,
      });

      resetForm();
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // EDIT HANDLER
  // =========================
  const onEditHandler = (addr: Address) => {
    setForm({
      label: addr.label,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isDefault: addr.isDefault,
    });

    setEditingId(addr.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // INITIAL FETCH
  // =========================
  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-app-green">
            My Addresses
          </h1>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            disabled={submitting}
            className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <PlusIcon className="size-4" />
            Add Address
          </button>
        </div>

        {/* ADDRESS FORM */}
        {showForm && (
          <div className="mb-8">
            <AddressForm
              resetForm={resetForm}
              handleSubmit={handleSubmit}
              form={form}
              setForm={setForm}
              editingId={editingId}
              submitting={submitting}
            />
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <Loading />
        ) : addresses.length === 0 ? (
          // EMPTY STATE
          <div className="text-center py-16 bg-white rounded-2xl border border-app-border">
            <MapPinIcon className="size-16 text-app-border mx-auto mb-4" />

            <h2 className="text-lg font-semibold text-app-green mb-2">
              No addresses saved
            </h2>

            <p className="text-sm text-app-text-light">
              Add your first delivery address
            </p>
          </div>
        ) : (
          // ADDRESS LIST
          <div className="space-y-4">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                addr={addr}
                onEditHandler={onEditHandler}
                setAddresses={setAddresses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;