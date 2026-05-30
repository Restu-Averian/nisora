export default function ProfileJoinedDate({ joinedDate }) {
  return (
    <div className="profile-joined-date">
      <p className="profile-joined-date__label">Bergabung Sejak</p>
      <p className="profile-joined-date__value">
        Dibuat pada: {joinedDate}
      </p>
    </div>
  );
}
