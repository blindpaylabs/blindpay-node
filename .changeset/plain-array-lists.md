---
"@blindpay/node": major
---

`payouts.list`, `customers.list` and `payables.list` responses are typed as either the paginated envelope or a plain array, like `payins.list` already was. The API returns every match as a plain array when no pagination parameter (`limit`, `starting_after`, `ending_before`) is passed, so code that reads `data.data` must first check `Array.isArray(data)`.
