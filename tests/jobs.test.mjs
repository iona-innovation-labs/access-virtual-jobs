import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

// Public jobs board on the production Access Virtual Jobs site.
describe("Access Virtual Jobs — jobs board", () => {
  it("loads the jobs board and lets you search by keyword", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({
      url: "https://accessvirtualjobs.com/jobs",
    });

    // Jobs board hero + search UI renders
    const heroResult = await testdriver.assert(
      'The jobs page displays a "Browse Online Jobs" hero and a search box with placeholder to search by title or keyword',
    );
    expect(heroResult).toBeTruthy();

    // Search for a common role
    await testdriver
      .find('the job search input box with placeholder "Search by title or keyword..."')
      .click();
    await testdriver.type("assistant");
    await testdriver.pressKeys(["enter"]);
    await testdriver.wait(3000);

    // The search keyword persists in the search field after submitting
    const searchResult = await testdriver.assert(
      'The job search box contains the text "assistant"',
    );
    expect(searchResult).toBeTruthy();
  });
});
