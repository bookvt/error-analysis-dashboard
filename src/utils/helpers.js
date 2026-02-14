export const getFormattedDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const parseCSVLine = (line) => {
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const values = line.split(regex);
    return values.map(val => {
      let v = val.trim();
      if (v.startsWith('"') && v.endsWith('"')) {
        v = v.slice(1, -1);
      }
      return v;
    });
};
