$(function () {
    $(window).load(function () {
        PrepareNetwork();
    });
});

var JsonContract = null;
var web3 = null;
var MyContract = null;
var Owner = null;
var TokenName = null;
var TokenSymbol = null;
var TotalSupply = null;
var Balance_CurrentAccount = 0;
var CurrentAccount = null;

async function PrepareNetwork() {
    await loadWeb3();
    await LoadDataSmartContract();
}

async function loadWeb3() {

    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
            CurrentAccount = accounts[0];
            web3.eth.defaultAccount = CurrentAccount;
            console.log('current account: ' + CurrentAccount);
            setCurrentAccount();
        });
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    ethereum.on('accountsChanged', handleAccountChanged);
    ethereum.on('chainChanged', handleChainChanged);

}

function setCurrentAccount() {
    $('#Address').text(CurrentAccount);
}

async function handleAccountChanged() {
    await ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
        CurrentAccount = accounts[0];
        web3.eth.defaultAccount = CurrentAccount;
        console.log('current account: ' + CurrentAccount);
        setCurrentAccount();
        window.location.reload();
    });
}

async function handleChainChanged(_chainId) {

    window.location.reload();
    console.log('Chain Changed: ', _chainId);
}

async function LoadDataSmartContract() {
    await $.getJSON('Token.json', function (contractData) {
        JsonContract = contractData;
    });

    web3 = await window.web3;

    const networkId = await web3.eth.net.getId();

    const networkData = JsonContract.networks[networkId];
    if (networkData) {
        MyContract = new web3.eth.Contract(JsonContract.abi, networkData.address);

        TokenName = await MyContract.methods.name().call();
        TokenSymbol = await MyContract.methods.symbol().call();
        TotalSupply = await MyContract.methods.totalSupply().call();
        Owner = await MyContract.methods.owner().call();
        Blence_CurrentAccount = await MyContract.methods.balanceOf(CurrentAccount).call();


        $('#TokenName').text(TokenName);
        $('#TokenSymbol').text(TokenSymbol);
        $('#TotalSupply').text(TotalSupply);
        $('#Owner').text(Owner);
        $('#Blence_CurrentAccount').text(Blence_CurrentAccount);


    }

    $(document).on('click', '#mint', mint);
    $(document).on('click', '#transfer', transfer);
    $(document).on('click', '#Approve', Approve);
    $(document).on('click', '#TransfeFrom', TransfeFrom);
    $(document).on('click', '#Allowance', Allowance);
    $(document).on('click', '#increaseAllowance', increaseAllowance);
    $(document).on('click', '#decreaseAllowance', decreaseAllowance);
    $(document).on('click', '#Burn', Burn);
    $(document).on('click', '#BurnFrom', BurnFrom);
    $(document).on('click', '#mintcap', mintcap);

}

function mintcap() {

    if (Owner.toLowerCase() != CurrentAccount) {
        alert('Only Owner Can Do it');
        return;
    }

    var amount = $('#amountmintcap').val();
    if (amount.trim() == '') {
        alert('Please Fill Text...');
        return;
    }

    MyContract.methods.MintCap(amount).send({ from: CurrentAccount }).then(function (Instanse) {

        alert(Instanse.events.Transfer.returnValues[2] + ' Tokens Minted By ' +
            Instanse.events.Transfer.returnValues[1]);
        window.location.reload();
    }).catch(function (error) {
        console.log(error.message);
    });


}


function BurnFrom() {
    var address = $('#AdressToBurnFrom').val();
    var amount = $('#AmountBurnFrom').val();

    if (address.trim() == '' || amount.trim() == '') {
        alert('Please Fill Text...');
        return;
    }

    MyContract.methods.burnFrom(address, amount).send({ from: CurrentAccount }).then(function (Instanse) {

        alert(Instanse.events.Transfer.returnValues[2] + ' Tokens with ' +
            Instanse.events.Transfer.returnValues[0] + 'Burn with ' + Instanse.Transfer.returnValues[1]);

        //   window.location.reload();
    }).catch(function (error) {
        console.log(error.message);
    });

}

function Burn() {
    var amount = $('#amountBurn').val();

    if (amount.trim() == '') {
        alert('Please Fill Text...');
        return;
    }

    MyContract.methods.burn(amount).send({ from: CurrentAccount }).then(function (Instanse) {

        alert(Instanse.events.Transfer.returnValues[2]  + ' Tokens with ' +
            Instanse.events.Transfer.returnValues[0] + ' Burned');

        //   window.location.reload();
    }).catch(function (error) {
        console.log(error.message);
    });
}

function increaseAllowance() {
    var address = $('#AdressToincreaseAllowance').val();
    var amount = $('#AmountAdressToincreaseAllowance').val();

    if (address.trim() == '' || amount.trim() == '') {
        alert('Please Fill Text...');
        return;
    }

    MyContract.methods.increaseAllowance(address, amount).send({ from: CurrentAccount }).then(function (Instanse) {

        alert(Instanse.events.Approval.returnValues[2]  + ' Tokens with ' +
            Instanse.events.Approval.returnValues[0] + 'Increase Approve To ' + Instanse.events.Approval.returnValues[1]);

        //   window.location.reload();
    }).catch(function (error) {
        console.log(error.message);
    });

}

function decreaseAllowance() {
    var address = $('#AdressTodecreaseAllowance').val();
    var amount = $('#AmountAdressTodecreaseAllowance').val();

    if (address.trim() == '' || amount.trim() == '') {
        alert('Please Fill Text...');
        return;
    }

    MyContract.methods.decreaseAllowance(address, amount).send({ from: CurrentAccount }).then(function (Instanse) {

        alert(Instanse.events.Approval.returnValues[2]  + ' Tokens with ' +
            Instanse.events.Approval.returnValues[0] + 'Decrease Approve To ' + Instanse.events.Approval.returnValues[1]);

        //   window.location.reload();
    }).catch(function (error) {
        console.log(error.message);
    });
}

async function Allowance() {

    var addressfrom = $('#AdressFromAllowance').val();
    var addressto = $('#AdressToAllowance').val();

    if (addressfrom.trim() == '' || addressto.trim() == '') {
        alert('Please Fill Text...');
        return;
    }

    var Allowance = await MyContract.methods.allowance(addressfrom, addressto).call();

    alert(addressfrom + 'Allowance to ' + addressto + ' = ' + Allowance );

}


function TransfeFrom() {

    var amount = $('#AmountAdressToTransfeFrom').val();
    var addressfrom = $('#AdressFromTransfeFrom').val();
    var addressto = $('#AdressToTransfeFrom').val();

    if (amount.trim() == '' || addressfrom.trim() == '' || addressto.trim() == '') {
        alert('Please Fill Text...');
        return;
    }


    MyContract.methods.transferFrom(addressfrom, addressto, amount).send({ from: CurrentAccount }).then(function (Instanse) {

        console.log(Instanse)

        alert(Instanse.events.Transfer.returnValues[2]  + ' Tokens transfer ' +
            Instanse.events.Transfer.returnValues[0] + ' To ' + Instanse.events.Transfer.returnValues[1]);

        alert(Instanse.events.Approval.returnValues[2]  + ' Tokens  with' +
            Instanse.events.Approval.returnValues[0] + ' Approve To ' + Instanse.events.Approval.returnValues[1]);

        //   window.location.reload();
    }).catch(function (error) {
        console.log(error.message);
    });



}

function Approve() {
    var amount = $('#AmountAdressToApprove').val();
    var address = $('#AdressToApprove').val();

    if (amount.trim() == '' || address.trim() == '') {
        alert('Please Fill Text...');
        return;
    }

    MyContract.methods.approve(address, amount).send({ from: CurrentAccount }).then(function (Instanse) {

        alert(Instanse.events.Approval.returnValues[2]  + ' Tokens with ' +
            Instanse.events.Approval.returnValues[0] + ' Approve To ' + Instanse.events.Approval.returnValues[1]);

        //   window.location.reload();
    }).catch(function (error) {
        console.log(error.message);
    });

}



function transfer() {

    var amount = $('#AmountAdressToTransfer').val();
    var address = $('#AdressToTransfer').val();

    if (amount.trim() == '' || address.trim() == '') {
        alert('Please Fill Text...');
        return;
    }

    MyContract.methods.transfer(address, amount).send({ from: CurrentAccount }).then(function (Instanse) {

        alert(Instanse.events.Transfer.returnValues[2] + ' Tokens with ' +
            Instanse.events.Transfer.returnValues[0] + ' Send To ' + Instanse.events.Transfer.returnValues[1]);
        window.location.reload();
    }).catch(function (error) {
        console.log(error.message);
    });

}


function mint() {

    if (Owner.toLowerCase() != CurrentAccount) {
        alert('Only Owner Can Do it');
        return;
    }

    var amount = $('#amountmint').val();
    if (amount.trim() == '') {
        alert('Please Fill Text...');
        return;
    }

    //  var taxparam = {
    //     from:CurrentAccount,
    //     to:
    //     gas:

    //  };

    MyContract.methods.mint(amount).send({ from: CurrentAccount }).then(function (Instanse) {

        alert(Instanse.events.Transfer.returnValues[2] + ' Tokens Minted By ' +
            Instanse.events.Transfer.returnValues[1]);
        window.location.reload();
    }).catch(function (error) {
        console.log(error.message);
    });

}

