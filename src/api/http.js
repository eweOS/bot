async function getpkginfo(pkgname, repo = "main", arch = "x86_64") {
  return await fetch(
    `https://github.com/eweOS/workflow/raw/pkginfo-${arch}/${repo}/${pkgname}.json`
  );
}

export { getpkginfo };
