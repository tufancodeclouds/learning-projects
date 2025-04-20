const Button = ({btnText, handleAllTodoData}) => {
    return (
      <button className="clear-btn" onClick={() => handleAllTodoData()}>
        {btnText}
      </button>
    );
}

export default Button;