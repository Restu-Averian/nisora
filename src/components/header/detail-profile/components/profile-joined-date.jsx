import leafBadge from "@/assets/leaf_badge_icon.webp";

export default function ProfileJoinedDate({ joinedDate }) {
  return (
    <div className="profile-joined-date">
      <img src={leafBadge} alt="" className="profile-joined-date__icon" />
      <div className="profile-joined-date__text">
        <p className="profile-joined-date__label">Bergabung Sejak</p>
        <p className="profile-joined-date__value">
          Dibuat pada: {joinedDate}
        </p>
      </div>
    </div>
  );
}
