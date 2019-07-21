app.controller('country_controller', function ($scope, $http) {


	// For getting country names list for auto complete process

	var request = $http({
		method: "get",
		url: "/get_codes",
		headers: {
			'Content-Type': 'application/json'
		}
	});

	request.success(function (data) {
		$scope.selectedObj = {};
		$scope.nationalities = data;
	});


	// Function used to clear already existing information of previous search data

	$scope.countryNametitle = false;
	$scope.clearDiv = function () {
		$scope.countryNametitle = false;
		$scope.error = false;
		$scope.countryName = '';
		$scope.languagesSpoken = '';
		$scope.neighborCountries = '';
		$scope.flagdiv = false;
		$scope.flagimg = '';

	};

	// Method used to call node service to get meta data of selected country
	$scope.get_info = function () {

		var countryname = document.getElementById('country_value').value;
		if(countryname=='') {
			$scope.error = true;
			return;
		}
		$scope.countryNametitle = false;
		$scope.countryName = '';
		$scope.languagesSpoken = '';
		$scope.neighborCountries = '';
		$scope.flagdiv = false;
		$scope.flagimg = '';
		$scope.error = false;

		var request = $http({
			method: "post",
			url: "/get_meta",
			data: {
				data: countryname
			},
			headers: {
				'Content-Type': 'application/json'
			}
		});

		request.success(function (data) {

			if (!data.errno) {
				var neighborcountries = data.borders;

				if (data.borders && data.borders.length > 0) {
					var request = $http({
						method: "post",
						url: "/get_neighbours",
						data: {
							data: neighborcountries
						},
						headers: {
							'Content-Type': 'application/json'
						}
					});

					request.success(function (data) {
						var result = data.map(function (val) {
							return val.name;
						}).join(',');
						$scope.neighborCountries = result;
					});
				}
				$scope.countryNametitle = true;
				$scope.countryName = data.name;

				var langs = data.languages;

				var result = langs.map(function (val) {
					return val.name;
				}).join(',');
				$scope.languagesSpoken = result;

				$scope.flagdiv = true;
				$scope.flagimg = data.flag;
			}
		});
	};
});