function checkmessage(message) {
  const allowed_users = [
    283338155, // @YukariChiba
    5990757608, // @ziyao233
  ];

  const allowed_groups = [
    -1001650785315, // @eweos4dev
    -511871661, // YukariChiba Personal Test Group
  ];
  if (!message.text) return false;
  if (!message.from) return false;
  if (!allowed_users.includes(message.from.id)) return false;
  if (message.chat.type === "channel") return false;
  if (message.chat.type !== "private")
    if (!allowed_groups.includes(message.chat.id)) return false;
  return true;
}

export { checkmessage };
