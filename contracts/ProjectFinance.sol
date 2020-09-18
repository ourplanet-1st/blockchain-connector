// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.5.6;

contract ProjectFinance {
    
    struct BankAccount {
      bytes32 name;
      bytes32 accountNumber;
      bool doesExist;
    }

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
      address pfConstructor; // 시행사
      bool doesExist;
      Step[] stepList; // list of Step keys so we can look up them
    }

    event CreateBankAccount(address indexed addr, bytes32 name, bytes32 accountNumber);
    event CreateProject(bytes32 projectId, address indexed pfBanker, address indexed pfEnforcer, address indexed pfConstructor);

    mapping (address => BankAccount) public bankAccounts;
    mapping (bytes32 => Project) public projects;
    bytes32[] public projectsLUT;

    modifier onlyUniqueBankAccountAllowed(address _addr) {
      require(
        bankAccounts[_addr].doesExist == false,
        "given _addr already has bankAccount"
      );
      _;
    }

    modifier onlyUniqueProjectIdAllowed(bytes32 _projectId) {
      require(
        projects[_projectId].doesExist == false,
        "given _projectId already exists." 
      );
      _;
    }

    modifier projectExists(bytes32 _projectId) {
      require(
        projects[_projectid].doesExist,
        "given _projectId dose not exists." 
      )
    }

    constructor() public {

    }
    
    function createBankAccount(
      address _addr,
      bytes32 _name,
      bytes32 _accountNumber
    )
    public
    onlyUniqueBankAccountAllowed(_addr)
    returns (bool) {
      bankAccounts[_addr].name = _name;
      bankAccounts[_addr].accountNumber = _accountNumber;
      bankAccounts[_addr].doesExist = true;
      emit CreateBankAccount(_addr, _name, _accountNumber);
      return true;
    }

    function createProject(
      bytes32 _projectId,
      address _pfBanker, // 금융사
      address _pfEnforcer, // 시행사
      address _pfConstructor // 시행사
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
      projects[projectId].stepList.push(
        Step(_stepId, progressPercentage, amountOfMoney, currency, true)
      );
    }
    }
}