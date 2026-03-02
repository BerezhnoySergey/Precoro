<script setup lang="ts">
import arrowDownWhite from "../assets/images/icons/arrow-down-white.svg";
import BuyNow from "../assets/images/icons/buy-now.svg";
import onBoardingIcon from "../assets/images/icons/onboarding.svg";
import helpCenterIcon from "../assets/images/icons/help-center.svg";
</script>

<template>
	<div class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
		<div
			class="flex h-[40px] justify-between bg-[linear-gradient(90deg,#161B40_0%,#2E3985_100%)] shadow-[0px_16px_16px_-16px_rgba(54,62,113,0.5)]"
		>
			<div class="flex items-center pl-[24px]">
				<p class="text-base font-medium text-white">Dashboard</p>
				<div class="flex h-6 w-6 items-center justify-center p-1">
					<img
						:src="arrowDownWhite"
						alt=""
						class="-rotate-90 h-auto w-auto max-h-full max-w-full"
					/>
				</div>
				<p class="text-base font-medium text-white">User Management</p>
			</div>
			<div class="flex items-center">
				<div class="mr-[28px] flex items-center">
					<img
						:src="BuyNow"
						alt=""
						class="mr-[8px] h-auto w-auto max-h-full max-w-full"
					/>
					<p class="text-base font-medium text-white">Buy now</p>
				</div>

				<div class="mr-[28px] flex items-center">
					<img
						:src="onBoardingIcon"
						alt=""
						class="mr-[8px] h-auto w-auto max-h-full max-w-full"
					/>
					<p class="text-base font-medium text-white">Onboarding</p>
				</div>
				<div class="mr-[28px] flex items-center">
					<img
						:src="helpCenterIcon"
						alt=""
						class="mr-[8px] h-auto w-auto max-h-full max-w-full"
					/>
					<p class="text-base font-medium text-white">Help center</p>
				</div>
				<div class="mr-[24px] flex items-center">
					<img
						:src="arrowDownWhite"
						alt=""
						class="mr-[8px] h-auto w-auto max-h-full max-w-full cursor-pointer"
					/>
					<p class="text-base font-medium text-white">user@email.com</p>
				</div>
			</div>
		</div>
	</div>
</template>
