const mod = (a, m) => {
  let tmp = a;

  while (tmp < 0) {
    tmp = tmp + m;
  }

  return tmp % m;
}

export default mod;
