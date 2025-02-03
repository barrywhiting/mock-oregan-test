import React from "react";
import TextEntry from './TextEntry';
import renderer from 'react-test-renderer';

describe("Snapshot test for the TextEntry component", () => {
  it("Matches DOM Snapshot", () => {
    const domTree = renderer.create(<TextEntry />).toJSON();
    expect(domTree).toMatchSnapshot();
  });
});
