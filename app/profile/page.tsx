"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 1. Fetch real user data from the backend when the page loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Make sure you create this /me route in your Express backend!
        const res = await fetch("http://localhost:5050/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setFullName(data.user?.fullName || data.fullName || "User");
          setEmail(data.user?.email || data.email || "No email found");
          
          // If you have profile pictures saved in your DB, set it here:
          // if (data.user?.profileImage) setProfilePic(`http://localhost:5050${data.user.profileImage}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/login";
  };

  // 2. Save the new name to your backend
  const handleSaveName = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      
      const res = await fetch("http://localhost:5050/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ fullName })
      });

      if (res.ok) {
        setIsEditingName(false);
      } else {
        alert("Failed to update name");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Upload the image directly to your Multer middleware
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview instantly
      const objectUrl = URL.createObjectURL(file);
      setProfilePic(objectUrl);
      
      // Send to backend using FormData
      const formData = new FormData();
      formData.append("profileImage", file); // Matches your uploads.single('profileImage')
      
      try {
        const token = Cookies.get("token");
        await fetch("http://localhost:5050/api/auth/update-profile", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}` // No Content-Type needed for FormData!
          },
          body: formData
        });
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative font-sans overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,115,0,0.15),transparent_40%)] pointer-events-none" />

      <div className="relative max-w-md mx-auto pt-12 px-6 pb-16">
        
        {/* Top Bar */}
        <div className="relative flex justify-center items-center w-full mb-12">
          <button 
            onClick={() => router.back()} 
            className="absolute left-0 p-2 rounded-full hover:bg-white/5 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="text-2xl font-extrabold tracking-wide">
            Profile
          </h1>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-14">

          {/* Avatar */}
          <div className="relative group w-36 h-36">
            
            {/* Gradient Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-600 via-orange-400 to-yellow-400 p-[3px] opacity-80 group-hover:opacity-100 transition">
              <div className="w-full h-full bg-black rounded-full" />
            </div>

            <label className="absolute inset-1 rounded-full overflow-hidden cursor-pointer border border-zinc-800">
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-4xl font-bold text-zinc-500 uppercase">
                  {fullName !== "Loading..." ? fullName.charAt(0) : "?"}
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-semibold transition">
                Change
              </div>

              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Name Section & Edit Button */}
          <div className="mt-6 text-center w-full flex flex-col items-center">
            {isEditingName ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 px-4 py-3 rounded-2xl text-center text-lg font-bold focus:outline-none focus:border-orange-500 w-3/4 transition"
                  autoFocus
                />
                <div className="flex gap-6">
                  <button 
                    onClick={handleSaveName}
                    disabled={isLoading}
                    className="text-orange-500 font-bold hover:scale-105 active:scale-95 transition disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button 
                    onClick={() => setIsEditingName(false)}
                    className="text-zinc-500 hover:text-zinc-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  {fullName}
                </h2>
                
                {/* Edit Button directly below the name */}
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium text-zinc-300 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-xl mb-10 hover:border-orange-500/30 transition-all">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2">
            Email Address
          </p>
          <p className="text-lg font-semibold text-zinc-200">
            {email}
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-500 font-bold tracking-wide hover:bg-red-500 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          Logout
        </button>

      </div>
    </div>
  );
}