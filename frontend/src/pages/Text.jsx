
const Text = () => {
    return (
        <div>
            <table border="1">
                <tbody>
                    <tr>
                        <td rowSpan="2">Merged Cell</td>
                        <td>Row 1, Col 2</td>
                    </tr>
                    <tr>
                        <td>Row 2, Col 2</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Text
