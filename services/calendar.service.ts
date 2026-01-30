export const getCalendarDays = async (month: number, year: number) => {
  if (!month || !year) {
    return;
  }
  try {
    const res = await fetch(
      `${process.env.SERVER_URL}/calendar?year=${year}&month=${month}`,
    );
    return res.json();
  } catch (error) {
    return { error: error, data: [] };
  }
};
