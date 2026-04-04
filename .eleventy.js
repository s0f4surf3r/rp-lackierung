module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy({ "src/site.webmanifest": "site.webmanifest" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "favicon.ico": "favicon.ico" });

  // News-Collection — sortiert nach Datum (neueste zuerst)
  eleventyConfig.addCollection("news", function (collectionApi) {
    return collectionApi.getFilteredByTag("news")
      .sort((a, b) => b.date - a.date);
  });

  // Datum-Filter für DE-Format
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("de-DE", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  eleventyConfig.setServerOptions({ host: "0.0.0.0", port: 8080 });

  return {
    dir: { input: "src", includes: "_layouts", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
