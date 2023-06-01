import { Link } from "react-router-dom";
import Container from "../components/Container";

export default function Blank() {
  return (
    <section>
      <Container className="flex flex-col items-center gap-8">
        <h1 className="text-gray-700 font-black text-[14rem] text-center">4 0 4</h1>
        <Link to="/" className="text-blue-500">Go to Homepage</Link>
      </Container>
    </section>
  )
}