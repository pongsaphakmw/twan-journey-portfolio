import PhysicsSpace from '@/components/PhysicsSpace';

export default function Home() {
  return (
    <div className="w-full h-full bg-[#0d1117] relative">
      {/* Height is controlled by parent layout usually, but ensures it fills available space */}
      <PhysicsSpace />
    </div>
  );
}
