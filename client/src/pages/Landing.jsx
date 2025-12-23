import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import { Link } from "react-router-dom";
import { Logo } from "../components";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Job <span>tracking </span>app
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
            molestiae rerum quam numquam voluptates ex vitae animi perspiciatis
            perferendis ipsa officiis molestias explicabo dignissimos veniam
            nam, ratione officia odit placeat et optio suscipit nulla. Mollitia
            temporibus corrupti,
          </p>
          <Link to="/register" className="btn register-link">
            register
          </Link>
          <Link to="/login" className="btn ">
            login / demo
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
