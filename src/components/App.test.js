import App from './App';
import React from "react";
import renderer from 'react-test-renderer';

describe("Snapshot test for the App component", () => {
  it("Matches DOM Snapshot", () => {
    const domTree = renderer.create(<App />).toJSON();
    expect(domTree).toMatchSnapshot();
  });
});
