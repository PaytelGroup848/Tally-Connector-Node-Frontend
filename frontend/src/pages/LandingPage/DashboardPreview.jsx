import logo from "../../assets/Ctrl-Books-New-Dashboard-Image-2 (1).webp";

export default function DashboardPreview() {
  return (
    <img
  className="w-full h-[600px]"
  src={logo}
  alt="Dashboard Preview"
  fetchPriority="high"
/>
  );
}