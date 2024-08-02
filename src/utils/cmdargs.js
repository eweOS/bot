function split_command_once(args, split = " ") {
  var first_elem = null;
  var remains_elem = null;
  if (!args.includes(split)) first_elem = args;
  else {
    const idx = args.indexOf(split);
    first_elem = args.slice(0, idx);
    remains_elem = args.slice(idx + 1);
  }
  return { first: first_elem, remains: remains_elem };
}

function testarg_number(arg) {
  return /^\d+$/.test(arg);
}

function testarg_pkgname(arg) {
  if (!arg) return false;
  const regex = new RegExp("^[.0-9a-zA-Z_-]+$", "g");
  return regex.test(arg);
}

function testarg_string_not_quoted(arg) {
  const regex = new RegExp("^[^'\"]*$", "g");
  return regex.test(arg);
}

export { split_command_once, testarg_pkgname, testarg_string_not_quoted, testarg_number };
