type Props = {
  error: string;
  result: boolean | null;
  roomName: string | null;
};

export default function ResultPanel({ error, result, roomName }: Props) {
  return (
    <>
      {error && <p className="error">{error}</p>}
      {result !== null && roomName && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>
          {roomName}: {result ? 'Available' : 'Unavailable'}
        </p>
      )}
    </>
  );
}