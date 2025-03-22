// Bus images for the booking system
const busImages = {
  // Default image if no specific bus is found
  default: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
  
  // The 3 main bus types
  regularBus: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
  luxuryBus: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  sleeperBus: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80',
  
  // Function to get the appropriate image based on bus details
  getBusImage: function(bus) {
    if (!bus) return this.default;
    
    // Check bus name for type
    const busName = bus.name.toLowerCase();
    
    if (busName.includes('luxury') || 
        busName.includes('premium') || 
        busName.includes('deluxe') || 
        busName.includes('ac')) {
      return this.luxuryBus;
    }
    
    if (busName.includes('sleeper') || 
        busName.includes('night') || 
        busName.includes('overnight')) {
      return this.sleeperBus;
    }
    
    // Default to regular bus
    return this.regularBus;
  }
};

export default busImages; 