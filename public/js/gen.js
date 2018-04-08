class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
        };

        // convert address to right protocol
        var protocolPrefix = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
        this.socketAddress = protocolPrefix + '//' + location.host + props.address;
        this.socket = null;
        
        this.handleClick = this.handleClick.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleOpen.bind(this);
    }

    handleOpen() {
        console.log('socket open');
        this.setState({
            isConnected: true,
        });
    }

    handleClose() {
        console.log('socket closed');
        this.setState({
            isConnected: false,
        });
    }

    handleClick(e) {
        e.preventDefault();
        this.setState(prevState => ({
            isConnected: prevState.isConnected
        }));
    }

    handleMessage(e) {
        console.log('Received: ', e.data);
    }

    componentDidMount() {
        this.socket = new WebSocket(this.socketAddress);
        this.socket.onmessage = this.handleMessage;
        this.socket.onopen = this.handleOpen;
        this.socket.onclose = this.handleClose;
    }

    componentWillUnmount() {
        this.socket.close()
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.isConnected ? 'DISCONNECT' : 'CONNECT'}
            </button>
        );
    }
}

ReactDOM.render(
    <form method="post" action="generate">
        <input type="text" value="8" name="length" readOnly="true" />
        <button type="submit">Give it now!</button>
        <Toggle address="/ws" />
    </form>,
    document.getElementById('root')
);