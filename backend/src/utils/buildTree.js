function buildTree(nodes, rootParentId = null) {
    // Convert ids to strings once for faster lookup
    const nodeMap = nodes.map((n) => ({
      ...n,
      _id: String(n._id),
      parentId: n.parentId ? String(n.parentId) : null
    }));
  
    // Group nodes by parentId
    const parentGroups = {};
    nodeMap.forEach((node) => {
      const key = node.parentId || "root";
      if (!parentGroups[key]) parentGroups[key] = [];
      parentGroups[key].push(node);
    });
  
    // Recursive tree builder
    const build = (parentId) => {
      const groupKey = parentId || "root";
      const group = parentGroups[groupKey] || [];
  
      return group.map((n) => ({
        id: n._id,
        name: n.name,
        type: n.type,
        content: n.content || "",
        isOpen: Boolean(n.isOpen),
        children: build(n._id),
      }));
    };
  
    return build(rootParentId);
  }
  
  module.exports = { buildTree };
  