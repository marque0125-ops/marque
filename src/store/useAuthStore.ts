import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../utils/supabase";

export interface Address {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  jwtToken: string | null;
  userEmail: string;
  address: Address;
  setUserEmail: (email: string) => void;
  setAddress: (fields: Partial<Address>) => void;
  login: (name: string, phone: string, email?: string, token?: string) => void;
  loginWithSession: (name: string, phone: string, email: string, profile: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      jwtToken: null,
      userEmail: "",
      address: {
        name: "",
        phone: "",
        addressLine: "Medavakkam main road, Madipakkam",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600091",
        gstin: ""
      },
      setUserEmail: (email) => set({ userEmail: email }),
      setAddress: (fields) => set(state => ({ address: { ...state.address, ...fields } })),
      login: (name, phone, email, token) => {
        let finalEmail = email || "";
        let finalToken = token;
        if (email && email.includes(".") && email.split(".").length === 3) {
          finalToken = email;
          finalEmail = "";
        }

        const activeToken = finalToken || (() => {
          try {
            const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
            const payload = btoa(JSON.stringify({
              iss: "marque-rc-india",
              sub: phone,
              name: name,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 86400
            }));
            const signature = btoa("mock-signature-hash-value-for-offline-mode");
            return `${header}.${payload}.${signature}`;
          } catch (e) {
            return "mock.jwt.token";
          }
        })();

        set(state => ({
          isAuthenticated: true,
          jwtToken: activeToken,
          userEmail: finalEmail,
          address: {
            ...state.address,
            name,
            phone
          }
        }));

        const isConfigured = 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

        if (isConfigured) {
          (async () => {
            try {
              const { data: existing } = await supabase
                .from("profiles")
                .select("phone")
                .eq("phone", phone)
                .maybeSingle();

              if (!existing) {
                await supabase.from("profiles").insert([{
                  name,
                  phone,
                  address_line: get().address.addressLine || "Medavakkam main road, Madipakkam",
                  city: get().address.city || "Chennai",
                  state: get().address.state || "Tamil Nadu",
                  pincode: get().address.pincode || "600091"
                }] as any);
              }
            } catch (err) {
              console.warn("☁️ Supabase Cloud Sync Info: Profiles table write bypassed.", err);
            }
          })();
        }
      },
      loginWithSession: (name, phone, email, profile, token) => set(state => ({
        isAuthenticated: true,
        jwtToken: token,
        userEmail: email || "",
        address: {
          name: name || profile.name || "",
          phone: phone || profile.phone || "",
          addressLine: profile.address_line || "Medavakkam main road, Madipakkam",
          city: profile.city || "Chennai",
          state: profile.state || "Tamil Nadu",
          pincode: profile.pincode || "600091",
          gstin: profile.gstin || ""
        }
      })),
      logout: () => {
        try {
          supabase.auth.signOut();
        } catch (e) {
          console.warn("Offline signout completed.", e);
        }
        set({
          isAuthenticated: false,
          jwtToken: null,
          userEmail: "",
          address: {
            name: "",
            phone: "",
            addressLine: "",
            city: "",
            state: "",
            pincode: "",
            gstin: ""
          }
        });
      }
    }),
    {
      name: "marque-auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userEmail: state.userEmail,
        jwtToken: state.jwtToken,
        address: state.address
      })
    }
  )
);
