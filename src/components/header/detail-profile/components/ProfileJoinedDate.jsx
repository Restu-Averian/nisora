export default function ProfileJoinedDate({ joinedDate }) {
  return (
    <div className="text-center">
      <p className="text-[15px] leading-tight text-secondary-text">
        Bergabung Sejak
      </p>
      <p className="mt-1 text-[16px] leading-tight text-[#17131b]">
        Dibuat pada: {joinedDate}
      </p>
    </div>
  );
}
