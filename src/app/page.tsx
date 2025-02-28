import HomePage from "./component/pages/HomePage";
import ImageUploader from "./component/shared/ImageUploader";


export default function Home() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  return (
    <>
        <HomePage></HomePage>
    </>
  );
}
