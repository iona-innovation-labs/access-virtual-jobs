import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

// Smoke tests for the public (no-auth) pages of the production
// Access Virtual Jobs site: https://accessvirtualjobs.com
describe("Access Virtual Jobs — homepage", () => {
  it("loads the homepage and navigates to the jobs listing", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: "https://accessvirtualjobs.com" });

    // Homepage hero renders
    const homeResult = await testdriver.assert(
      'The homepage displays the headline "The Job Board for Virtual Workers Worldwide"',
    );
    expect(homeResult).toBeTruthy();

    // Navigate to the jobs listing via the top navigation
    await testdriver.find('the "Find Jobs" link in the top navigation bar').click();
    await testdriver.wait(3000);

    const jobsResult = await testdriver.assert(
      'The jobs page displays a "Browse Online Jobs" hero and a search box with placeholder to search by title or keyword',
    );
    expect(jobsResult).toBeTruthy();
  });
});
