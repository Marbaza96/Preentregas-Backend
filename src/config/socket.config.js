let io;

export const setSocketIO = (socketServer) => {
    io = socketServer;
};

export const getSocketIO = () => {
    return io;
};