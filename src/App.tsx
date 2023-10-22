import React, { FC } from "react";
import { render } from "react-dom";

import "./index.css";

const App: FC = () => <div>Hi there, I'm React from Webpack 5.</div>;

render(<App />, document.getElementById("root") as HTMLDivElement);
