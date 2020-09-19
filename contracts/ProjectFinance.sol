// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.5.6;

contract ProjectFinance {
    struct Step {
      bytes32 stepId;
      int32 progressPercentage;
      int32 amountOfMoney;
      bytes32 currency; // 화폐 단위
      bool doesExist;
    }

    struct Project {
      bytes32 projectId;
      address pfBanker; // 금융사
      address pfEnforcer; // 시행사
      address pfConstructor; // 시공사
      bool doesExist;
      Step[] stepList; // list of Step keys so we can look up them
    }

    event AddStepToProject(bytes32 indexed projectId, bytes32 stepId, int32 progressPercentage, int32 amountOfMoney, bytes32 currency);
    event CreateProject(bytes32 projectId, address indexed pfBanker, address indexed pfEnforcer, address indexed pfConstructor);

    mapping (bytes32 => Project) public projects;
    bytes32[] public projectsLUT;

    modifier onlyUniqueProjectIdAllowed(bytes32 _projectId) {
      require(
        projects[_projectId].doesExist == false,
        "given _projectId already exists." 
      );
      _;
    }

    modifier projectExists(bytes32 _projectId) {
      require(
        projects[_projectId].doesExist,
        "given _projectId dose not exists." 
      );
      _;
    }

    constructor() public {

    }
    
    function createProject(
      bytes32 _projectId,
      address _pfBanker, // 금융사
      address _pfEnforcer, // 시행사
      address _pfConstructor // 시공사
    ) 
    public 
    onlyUniqueProjectIdAllowed(_projectId)
    returns (bool) {
      projects[_projectId].projectId = _projectId;
      projects[_projectId].pfBanker = _pfBanker;
      projects[_projectId].pfEnforcer = _pfEnforcer;
      projects[_projectId].pfConstructor = _pfConstructor;
      projects[_projectId].doesExist = true;
      emit CreateProject(_projectId, _pfBanker, _pfEnforcer, _pfConstructor);
      return true;
    }

    function addStepToProject(
      bytes32 _stepId,
      bytes32 _projectId,
      int32 _progressPercentage,
      int32 _amountOfMoney,
      bytes32 _currency
    )
    public
    projectExists(_projectId)
    returns (bool) {
      projects[_projectId].stepList.push(
        Step(_stepId, _progressPercentage, _amountOfMoney, _currency, true)
      );
      emit AddStepToProject(_projectId, _stepId, _progressPercentage, _amountOfMoney, _currency);
    }

    function getStepsLength(
      bytes32 _projectId
    )
    public
    view
    projectExists(_projectId)
    returns (uint256) {
      return projects[_projectId].stepList.length;
    }
    
    function getStep(
      bytes32 _projectId,
      uint256 _index
    )
    public
    view
    returns (
      bytes32 stepId,
      int32 progressPercentage,
      int32 amountOfMoney,
      bytes32 currency
    ) {
      return ((
        projects[_projectId].stepList[_index].stepId,
        projects[_projectId].stepList[_index].progressPercentage,
        projects[_projectId].stepList[_index].amountOfMoney,
        projects[_projectId].stepList[_index].currency
      ));
    }
}