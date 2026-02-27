export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if (!data.postDate) {
      data.postDate = new Date();
    }
  },
};
