const contentHandle = (data) =>{
  return {
    user: data.user,
    content: data.content,
    tags: data.tags,
    type: data.type,
  };
}

module.exports = contentHandle;